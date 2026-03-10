import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import apiClient from "../api/apiClient";
import { setBlog } from "../redux/blogSlice";
import { setComments } from "../redux/commentSlice";

const Blog = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const blogs = useSelector((state) => state.blog.blog);
  const comments = useSelector((state) => state.comment.comments);

  const [view, setView] = useState("list"); // list | detail | form
  const [selectedBlog, setSelectedBlog] = useState(null);

  // blog form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);

  // comment form
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  /* ──────────────── FETCH HELPERS ──────────────── */

  const fetchBlogs = async () => {
    try {
      const { data } = await apiClient.get("/blog/getAllBlogs");
      dispatch(setBlog(data.data));
    } catch (err) {
      console.error("Failed to fetch blogs:", err.message);
      toast.error("Failed to load blogs. Please try again later.");
    }
  };

  const fetchComments = async (postId) => {
    try {
      const { data } = await apiClient.get(
        `/comment/getBlogComments/${postId}`,
      );
      dispatch(setComments(data.data));
    } catch {
      dispatch(setComments([]));
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ──────────────── BLOG CRUD ──────────────── */

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      if (editingBlogId) {
        await apiClient.patch(`/blog/updateBlog/${editingBlogId}`, formData);
      } else {
        await apiClient.post("/blog/createBlog", formData);
      }

      resetBlogForm();
      setView("list");
      fetchBlogs();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog and all its comments & images?"))
      return;
    try {
      await apiClient.delete(`/blog/deleteBlog/${id}`);
      fetchBlogs();
      if (selectedBlog?._id === id) {
        setSelectedBlog(null);
        setView("list");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  /* ──────────────── COMMENT CRUD ──────────────── */

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await apiClient.post(`/comment/createComment/${selectedBlog._id}`, {
        content: commentText,
      });
      setCommentText("");
      fetchComments(selectedBlog._id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await apiClient.patch(`/comment/updateComment/${commentId}`, {
        content: editCommentText,
      });
      setEditingCommentId(null);
      setEditCommentText("");
      fetchComments(selectedBlog._id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await apiClient.delete(`/comment/deleteComment/${commentId}`);
      fetchComments(selectedBlog._id);
    } catch (err) {
      alert(err.message);
    }
  };

  /* ──────────────── UI HELPERS ──────────────── */

  const resetBlogForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setEditingBlogId(null);
    setError("");
  };

  const openDetail = (blog) => {
    setSelectedBlog(blog);
    setView("detail");
    fetchComments(blog._id);
  };

  const startEdit = (blog) => {
    setEditingBlogId(blog._id);
    setTitle(blog.title);
    setDescription(blog.description);
    setFile(null);
    setView("form");
  };

  const startCreate = () => {
    resetBlogForm();
    setView("form");
  };

  const authorName = (blog) => {
    return blog.author?.name || "Unknown";
  };

  const commenterName = (comment) => {
    return comment.userId?.name || "Unknown";
  };

  const canModifyBlog = (blog) =>
    user.role === "admin" ||
    user._id === blog.author?._id ||
    user._id === blog.author;

  const canModifyComment = (comment) =>
    user.role === "admin" ||
    user._id === comment.userId?._id ||
    user._id === comment.userId;

  /* ──────────────── RENDER: Blog List ──────────────── */

  if (view === "list") {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>All Blogs</h2>
          <button onClick={startCreate}>+ New Blog</button>
        </div>

        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog._id}
              style={{
                border: "1px solid #ccc",
                padding: 16,
                margin: "8px 0",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h3
                    onClick={() => openDetail(blog)}
                    style={{ cursor: "pointer", color: "#1a0dab" }}
                  >
                    {blog.title}
                  </h3>
                  <p>
                    {blog.description.length > 150
                      ? blog.description.substring(0, 150) + "…"
                      : blog.description}
                  </p>
                  <small>
                    By: {authorName(blog)} &middot;{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </small>
                </div>

                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt=""
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 4,
                      marginLeft: 12,
                    }}
                  />
                )}
              </div>

              {canModifyBlog(blog) && (
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => startEdit(blog)}>Edit</button>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    style={{ marginLeft: 8, color: "red" }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No blogs yet.</p>
        )}
      </div>
    );
  }

  /* ──────────────── RENDER: Create / Edit Form ──────────────── */

  if (view === "form") {
    return (
      <div>
        <button
          onClick={() => {
            resetBlogForm();
            setView("list");
          }}
        >
          ← Back
        </button>

        <h2>{editingBlogId ? "Edit Blog" : "Create Blog"}</h2>

        <form onSubmit={handleBlogSubmit}>
          <div>
            <label>Title:</label>
            <br />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <label>Description:</label>
            <br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <label>Image (optional):</label>
            <br />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
            {loading
              ? "Saving…"
              : editingBlogId
                ? "Update Blog"
                : "Create Blog"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    );
  }

  /* ──────────────── RENDER: Blog Detail + Comments ──────────────── */

  if (view === "detail" && selectedBlog) {
    return (
      <div>
        <button onClick={() => setView("list")}>← Back</button>

        <div
          style={{
            border: "1px solid #ccc",
            padding: 16,
            margin: "8px 0",
            borderRadius: 8,
          }}
        >
          <h2>{selectedBlog.title}</h2>

          {selectedBlog.imageUrl && (
            <img
              src={selectedBlog.imageUrl}
              alt=""
              style={{ maxWidth: "100%", maxHeight: 400 }}
            />
          )}

          <p style={{ whiteSpace: "pre-wrap" }}>{selectedBlog.description}</p>

          <small>
            By: {authorName(selectedBlog)} &middot;{" "}
            {new Date(selectedBlog.createdAt).toLocaleDateString()}
          </small>
        </div>

        {/* ── Add Comment ── */}
        <h3>Comments ({comments?.length || 0})</h3>

        <form onSubmit={handleCreateComment} style={{ marginBottom: 16 }}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment…"
            rows={3}
            style={{ width: "100%" }}
            required
          />

          <button type="submit">Post Comment</button>
        </form>

        {/* ── Comment List ── */}
        {comments && comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c._id}
              style={{
                borderLeft: "3px solid #ddd",
                padding: "8px 12px",
                margin: "6px 0",
              }}
            >
              {editingCommentId === c._id ? (
                <div>
                  <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    rows={2}
                    style={{ width: "100%" }}
                  />
                  <button onClick={() => handleUpdateComment(c._id)}>
                    Save
                  </button>
                  <button onClick={() => setEditingCommentId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p style={{ margin: "4px 0" }}>{c.content}</p>
                  <small>
                    {commenterName(c)}
                    {c.editedAt && " · edited"}
                    {" · "}
                    {new Date(c.createdAt).toLocaleDateString()}
                  </small>

                  {canModifyComment(c) && (
                    <div style={{ marginTop: 4 }}>
                      <button
                        onClick={() => {
                          setEditingCommentId(c._id);
                          setEditCommentText(c.content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        style={{ marginLeft: 6, color: "red" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    );
  }

  return null;
};

export default Blog;
