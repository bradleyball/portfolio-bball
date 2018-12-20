import React from "react";
import BaseLayout from "../components/layouts/BaseLayout";
import BasePage from "../components/shared/BasePage";

class Blogs extends React.Component {
  render() {
    return (
      <BaseLayout>
        <BasePage>
          <h1> I am Blogs Page </h1>
        </BasePage>
      </BaseLayout>
    );
  }
}

export default Blogs;
