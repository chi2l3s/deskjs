import { Button, Hero, Page } from "@chi2l3s/tablejs/ui";
import { useParams, useRouter } from "@chi2l3s/tablejs";
import { getMovie } from "../../../src/movies";

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const movie = getMovie(params.id);

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
