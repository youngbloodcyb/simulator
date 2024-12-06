import { Main, Section, Container } from "@/components/craft";
import { Call } from "./call";
import Link from "next/link";
export default async function Page() {
  return (
    <Main>
      <Section>
        <Container>
          <div className="not-prose max-w-xl">
            <p className="text-sm mb-2">
              built by{" "}
              <Link
                href="https://x.com/youngbloodcyb"
                className="underline"
                target="_blank"
              >
                @youngbloodcyb
              </Link>{" "}
              &{" "}
              <Link
                href="https://x.com/AustonY"
                className="underline"
                target="_blank"
              >
                @austony
              </Link>
            </p>
            <h1 className="font-bold text-3xl">Call Center Simulator</h1>
            <h3 className="text-lg">
              As if it the job wasn&apos;t bad enough in real life...
            </h3>
            <h3 className="text-lg">
              Now you can simulate it!{" "}
              <span className="italic">Give it a try.</span>
            </h3>
          </div>
          <div className="mt-4">
            <Call />
          </div>
        </Container>
      </Section>
    </Main>
  );
}
