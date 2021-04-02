import React from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const apiHome = "http://204.48.22.214/api/";
export default class CategoryList extends React.Component {
  state = {
    novels1: [],
    currentPage: 1,
    category: this.props.match.params.category,
    categoryName: "",
    title: "Loading",
  };
  headers = {
    "Content-Type": "application/json",
  };
  axiFetch = (category, pagenum) => {
    axios
      .get(`${apiHome}/categories/${category}/?page=${pagenum}`, {
        headers: this.headers,
      })
      .then((res) => {
        const novels = res.data.results;

        novels.map((newEl) =>
          this.setState({ novels1: [...this.state.novels1, newEl] })
        );
        this.setState({
          categoryName: res.data.category.name,
          title: `Category - ${res.data.category.name}`,
        });
        this.setState({ currentPage: this.state.currentPage + 1 });
        console.log(this.state.novels1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    document.title = "Loading - PirateNovel";

    this.axiFetch(this.state.category, this.state.currentPage);
  }
  componentDidUpdate(prevProp) {
    const currentCategory = this.props.match.params.category;
    if (currentCategory !== prevProp.match.params.category) {
      this.setState({
        novels1: [],
        currentPage: 0,
        categoryName: currentCategory,
      });
      this.axiFetch(currentCategory, this.state.currentPage);
    }
  }
  render() {
    document.title = this.state.title;
    const buttonClick = () => {
      this.axiFetch(this.state.category, this.state.currentPage);
    };
    const categories = this.state.novels1
      ? this.state.novels1.map((category) => (
          <div
            key={category.name}
            className="card mx-auto mb-4"
            style={{ width: "13rem" }}
          >
            <img
              src={category.image}
              className="card-img-top"
              width="120"
              height="300"
            />

            <div class="card-body" style={{ marginRight: "20px" }}>
              <Link to={`/${category.slug}`}>
                <div>{category.name}</div>
              </Link>
            </div>
          </div>
        ))
      : "No news found";
    return (
      <>
        <div className="row">
          <div class="main-col col-md-8 col-sm-12">
            <div class="has-text-centered	">
              <h4 className="title is-3">{this.state.categoryName}</h4>
            </div>
            <br />

            <div class="d-flex align-content-center flex-wrap">
              {categories}
            </div>
            <div className="row d-flexrow justify-content-center">
              <button className="btn btn-primary" onClick={buttonClick}>
                Load More
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
