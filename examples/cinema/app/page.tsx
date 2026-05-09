import { Button, Grid, Hero, Page, Poster, Row } from "desk-js/ui";
import { mockMovies } from "../src/data/movies";

export default function HomePage() {
  const hero = mockMovies[0];
  return (
    <Page>
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        background={hero.backdrop}
        actions={
          <>
            <Button autoFocus>Resume</Button>
            <Button variant="secondary">Add to list</Button>
          </>
        }
      />
      <Row title="Continue watching">
        {mockMovies.map((movie) => (
          <Poster
            key={movie.id}
            href={`/movies/${movie.id}`}
            image={movie.image}
            title={movie.title}
          />
        ))}
      </Row>
      <h2 className="mb-5 px-16 text-3xl font-bold">Browse</h2>
      <Grid columns={4} gap={24}>
        {mockMovies.map((movie) => (
          <Poster
            key={movie.id}
            href={`/movies/${movie.id}`}
            image={movie.image}
            title={movie.title}
          />
        ))}
      </Grid>
    </Page>
  );
}
