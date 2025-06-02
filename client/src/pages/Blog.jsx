import { useId } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const data = {
  id: 1,
  title: "Nature is beautiful",
  content:
    "There is something profoundly calming and inspiring about nature. Whether it’s the gentle rustle of leaves in the breeze, the rhythmic crashing of ocean waves, or the vibrant hues of a sunset painting the sky — nature constantly reminds us of the beauty and balance in the world.🌳 A Source of Peace and Clarity In the fast-paced rush of modern life, nature offers a sanctuary. A walk through a quiet forest or time spent beside a river can help clear the mind and soothe the soul. Studies have even shown that spending time in nature reduces stress, improves mental health, and boosts creativity.🌄 Diversity Beyond Imagination From snow-capped mountains to tropical rainforests, from the tiniest insects to the largest mammals, nature is a grand exhibition of life in all its forms. Each ecosystem, species, and landscape plays a vital role in the delicate web of life. The variety is endless, and every moment spent observing it teaches us something new.🌎 A Reminder of What We Must Protect The beauty of nature is not just in how it looks but in what it gives us — clean air, fresh water, fertile soil, and a livable climate. It’s a gift we must cherish and protect. As stewards of this planet, we have a responsibility to preserve its wonders for generations to come.🌼 Final Thoughts Nature’s beauty is a quiet but powerful force. It speaks to us in colors, sounds, and sensations — reminding us of our place in the world and urging us to slow down and appreciate life’s simple pleasures. Let’s not take it for granted.",
  image: "painting-mountain-lake-with-mountain-background.jpg",
};

const Blog = () => {
  const blog = data;
  const id = useId();

  return (
    <>
      <div className="flex py-20 w-full items-center justify-center p-6 md:p-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <blockquote>
              <h1 className="text-center text-4xl font-semibold lg:text-5xl pb-5">
                {blog.title}
              </h1>
              <img src={blog.image} alt={blog.title} />
              {/* <p className="pt-5 text-lg font-medium sm:text-xl md:text-3xl text-justify"> */}
              <p className="pt-5 text-lg text-justify">{blog.content}</p>

              <div className="mt-12 flex  gap-6">
                <Avatar className="size-12">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Ashikur Rafi"
                    height="400"
                    width="400"
                    loading="lazy"
                  />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>

                <div className="space-y-1 border-l pl-6">
                  <cite className="font-medium">Ashikur Rafi</cite>
                  <span className="text-muted-foreground block text-sm">
                    {/* CEO, Nvidia */}Blog Creation time :{" "}
                    {new Date().toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            </blockquote>
          </div>
          <div className="pt-5">
            <div className="*:not-first:mt-2">
              <Label htmlFor={id}>Comment</Label>
              <Textarea id={id} placeholder="Leave a comment" />
              <div className="flex justify-end">
                <Button variant="outline">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
