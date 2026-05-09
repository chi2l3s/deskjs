import { Button, Hero, Page } from "deskjs/ui";
import { useParams, useRouter } from "deskjs";
import { mockMovies } from "../../../src/data/movies";

export default function MoviePage() {
  const { id } = useParams();
  const router = useRouter();
  const movie = mockMovies.find((item) => item.id === id) ?? mockMovies[0];

  return (
    <Page>
      <Hero
        title={movie.title}
        subtitle={movie.subtitle}
        description={movie.description}
        background={movie.backdrop}
        actions={
          <>
            <Button autoFocus>Play</Button>
            <Button variant="secondary" onClick={() => router.back()}>
              Back
            </Button>
          </>
        }
      />
    </Page>
  );
}
