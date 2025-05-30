import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const About = () => {
  return (
    <>
      {/* <section className="py-16 md:py-32"> */}
      <section className="flex py-20 w-full items-center justify-center p-6 md:p-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <blockquote>
                <h1 className="text-balance text-3xl font-semibold md:text-4xl pb-5">
              About me
            </h1>
              <p className="text-lg font-medium sm:text-xl md:text-3xl">
                I’m a Computer Science and Engineering graduate passionate about
                creating innovative tech solutions. Currently diving into
                Machine Learning and MERN stack web development, I’m eager to
                apply my skills and grow in the tech field.
              </p>

              <div className="mt-12 flex items-center justify-center gap-6">
                <Avatar className="size-12">
                  <AvatarImage
                    src="https://tailus.io/images/reviews/shekinah.webp"
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
                    {/* CEO, Nvidia */}
                  </span>
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
