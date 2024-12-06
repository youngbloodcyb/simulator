import { Main, Section, Container } from "@/components/craft";
import { Call } from "./call";

export default async function Page() {
  return (
    <Main>
      <Section>
        <Container>
          <h1>Heading</h1>
          <p>Content</p>
          <Call />
        </Container>
      </Section>
    </Main>
  );
}
