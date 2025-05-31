import {
  Gemini,
  GooglePaLM,
  MagicUI,
  MediaWiki,
  Replit,
  VSCodium,
} from "@/components/logos";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function IntegrationsSection() {
  const integrations = [
    {
      title: "Google Gemini",
      description:
        "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
      icon: <Gemini />,
      link: "https://github.com/meschacirung/cnblocks",
    },
    {
      title: "Replit",
      description:
        "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
      icon: <Replit />,
      link: "https://github.com/meschacirung/cnblocks",
    },
    {
      title: "Magic UI",
      description:
        "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
      icon: <MagicUI />,
      link: "https://github.com/meschacirung/cnblocks",
    },
    {
      title: "VSCodium",
      description:
        "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
      icon: <VSCodium />,
      link: "https://github.com/meschacirung/cnblocks",
    },
    {
      title: "MediaWiki",
      description:
        "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
      icon: <MediaWiki />,
      link: "https://github.com/meschacirung/cnblocks",
    },
    {
      title: "Google PaLM",
      description:
        "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
      icon: <GooglePaLM />,
      link: "https://github.com/meschacirung/cnblocks",
    },
  ];

  return (
    <section>
      <div className="flex py-20 w-full items-center justify-center p-6 md:p-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              All Blogs
            </h2>
            <p className="text-muted-foreground mt-6">
              Trending now a days
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration, index) => (
              <Card className="p-6" key={index}>
                <div className="relative">
                  <div className="*:size-10">{integration.icon}</div>

                  <div className="space-y-2 py-6">
                    <h3 className="text-base font-medium">
                      {integration.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {integration.description}
                    </p>
                  </div>

                  <div className="flex gap-3 border-t border-dashed pt-6">
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="gap-1 pr-2 shadow-none"
                    >
                      <Link href={integration.link}>
                        Learn More
                        <ChevronRight className="ml-0 !size-3.5 opacity-50" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
