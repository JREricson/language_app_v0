import { Helmet } from "react-helmet";
import { WEBSITE_NAME } from "../../common/global_app_constants";

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
  title: WEBSITE_NAME,
  description: "A set of tools for learning a new Language",
};

export default Title;
