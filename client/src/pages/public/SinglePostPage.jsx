import apiClient from "@/api/apiClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Loader2,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const SinglePostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get(`/blog/slug/${slug}`);
      setPost(response.data.data);
      fetchComments(response.data.data._id);
    } catch (err) {
      setError(err.response?.data?.message || "Post not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await apiClient.get(
        `/comment/getBlogComments/${postId}`,
      );
      setComments(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    setSubmittingComment(true);
    try {
      const response = await apiClient.post(
        `/comment/createComment/${post._id}`,
        {
          comment: comment.trim(),
        },
      );
      setComments([response.data.data, ...comments]);
      setComment("");
    } catch (err) {
      console.error("Failed to submit comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    setDeleting(true);
    try {
      await apiClient.delete(`/blog/deleteBlog/${post._id}`);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comment/deleteComment/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const canEditPost =
    user && (user.role === "admin" || user._id === post?.author?._id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
        </div>
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Link>
      </Button>

      {/* Post Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {post.category && (
            <Badge variant="secondary">{post.category.name}</Badge>
          )}
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author?.photoUrl} />
              <AvatarFallback>{getInitials(post.author?.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author?.name}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>

          {canEditPost && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/dashboard/edit-post/${post._id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deleting}>
                    {deleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this post? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeletePost}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <Separator className="my-8" />

      {/* Comments Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <Button
              type="submit"
              disabled={submittingComment || !comment.trim()}
            >
              {submittingComment ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Post Comment
            </Button>
          </form>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                Please login to leave a comment
              </p>
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((c) => (
            <Card key={c._id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={c.user?.photoUrl} />
                      <AvatarFallback>
                        {getInitials(c.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{c.user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(c.createdAt)}
                      </p>
                    </div>
                  </div>
                  {user &&
                    (user.role === "admin" || user._id === c.user?._id) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(c._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{c.comment}</p>
              </CardContent>
            </Card>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </section>
    </article>
  );
};

export default SinglePostPage;
