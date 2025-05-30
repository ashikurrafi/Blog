import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border px-6 py-12 md:py-20 lg:py-32">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
              404
            </h2>
            <p className="mt-4">Page not found</p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button asChild size="lg">
                <Link to={"/"}>
                  <span>Home</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PageNotFound;
