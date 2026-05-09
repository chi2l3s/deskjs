import { Button, Hero, Page, Poster, Row } from "@chi2l3s/tablejs/ui";
import { movies } from "../src/data";

export default function HomePage() {
  const hero = movies[0];
  return (
    <Page>
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        background={hero.backdrop}
        actions={
          <>
            <Button autoFocus>Watch now</Button>
            <Button variant="secondary">Details</Button>
          </>
        }
      />
      <Row title="Popular">
        {movies.map((movie) => (
          <Poster
            key={movie.id}
            title={movie.title}
            image={movie.image}
            href={`/movies/${movie.id}`}
          />
        ))}
      </Row>
    </Page>
  );
}
