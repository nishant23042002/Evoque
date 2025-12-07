import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import React from "react";

const Home = () => {
  return (
    <Container className="p-4 bg-accent-rose">
      <h1 className="text-xl font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur iusto nihil rerum nisi modi. Nemo impedit, animi voluptatum quibusdam dolorum eum quis vitae modi, quam, maiores neque! Cumque, atque voluptatibus.</h1>
      <Button size="lg">Click Me</Button>
    </Container>
  )
}

export default Home;