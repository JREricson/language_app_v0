import React from "react";
import { Helmet } from "react-helmet";

interface TitleProps {
  title: string;
  description: string;
}


const Title = ({ title, description }: TitleProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

    </Helmet>
  );
};

Title.defaultProps = {
  title: "Welcome to LanguaVersity",
  description: "A set of tools for learning a new Language",


};

export default Title;