import { Container } from "@mui/material";
import SectionTitle from "../ui/SectionTitle";
export default function SectionHero({ title, subTitle }) {
  return (
    <div className="section-hero " data-aos="fade-in">
      <Container
        sx={{
          zIndex: 200,
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <SectionTitle title={title} subTitle={subTitle} />
      </Container>
    </div>
  );
}
