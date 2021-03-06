import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BsFillStarFill } from 'react-icons/bs';
import { getProductById } from '../services/api';

class Details extends Component {
  constructor() {
    super();

    this.state = {
      product: {},
      atributo: [],
      disabled: true,
      email: '',
      rating: '',
      evaluation: '',
      evaluationSubmited: [],
    };
  }

  componentDidMount() {
    const evaluationSubmited = localStorage.getItem('submited-rate');
    if (evaluationSubmited) {
      const ratingElements = evaluationSubmited.split(',');
      console.log(ratingElements);
      this.setState({
        evaluationSubmited: ratingElements,
      });
      console.log(evaluationSubmited);
    }
    this.getProduct();
  }

  getProduct = async () => {
    const { match: { params: { id } } } = this.props;
    const promisse = await getProductById(id);
    const atributo = promisse.attributes;
    this.setState({
      product: promisse,
      atributo,
    });
  }

  handleEmailChange = ({ target }) => {
    const valueInput = target.value;
    this.setState({
      email: valueInput,
    }, () => {
      this.CheckDisabledBtn();
    });
  }

  handleEvaluationChange = ({ target }) => {
    const valueInput = target.value;
    this.setState({
      evaluation: valueInput,
    });
  }

  handleRateChange = ({ target }) => {
    const valueInput = target.value;
    this.setState({
      rating: valueInput,
    }, () => {
      this.CheckDisabledBtn();
    });
  }

  CheckDisabledBtn = () => {
    const { email, rating } = this.state;
    if (email.length > 0 && rating) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  }

    sendEvaluationToLocalStorage = () => {
      const { evaluationSubmited } = this.state;
      localStorage.setItem('submited-rate', evaluationSubmited);
      this.setState({
        email: '',
        rating: '',
        evaluation: '',
      });
    }

  handleSubmitClick = (event) => {
    event.preventDefault();
    const { email, rating, evaluation } = this.state;
    const evaluationFromUser = [email, rating, evaluation];
    this.setState((prevState) => ({
      evaluationSubmited: [...prevState.evaluationSubmited, evaluationFromUser],
    }), () => {
      this.sendEvaluationToLocalStorage();
    });
  }

  cardConstructor = () => {
    const { handleClick } = this.props;
    const { product,
      atributo,
      disabled,
      email,
      evaluation,
      evaluationSubmited,
    } = this.state;
    const ratingStars = ['1', '2', '3', '4', '5'];
    return (
      <div>
        <p data-testid="product-detail-name">
          { product.title }
        </p>
        <img src={ product.thumbnail } alt="Imagem" className="img-card-details" />
        <p>{ product.price }</p>
        <Link to="/ShoppingCart">
          <button
            type="button"
            onClick={ () => handleClick(product) }
            data-testid="product-detail-add-to-cart"
          >
            Adicionar ao carrinho

          </button>
        </Link>
        <hr />
        <div>
          {atributo.map((atribut, index) => (
            <div key={ index }>
              <span>{`${atribut.name}: ${atribut.value_name}`}</span>
            </div>
          ))}
        </div>
        <div className="rating-form-container">
          <form className="rating-form">
            <h2>Avalie este produto!</h2>
            <label htmlFor="email">
              E-mail
              <input
                type="email"
                id="email"
                name="email"
                placeholder="insira um email"
                data-testid="product-detail-email"
                onChange={ this.handleEmailChange }
                value={ email }
              />
            </label>
            {ratingStars.map((rate, index) => (
              <label
                htmlFor={ rate }
                key={ index }
              >
                <BsFillStarFill />
                <input
                  id={ rate }
                  type="radio"
                  data-testid={ `${index + 1}-rating` }
                  name="rate"
                  value={ rate }
                  onChange={ this.handleRateChange }
                />
              </label>
            ))}
            <label htmlFor="evaluation">
              Adicione um coment??rio:
              <textarea
                id="evaluation"
                placeholder="Deixe sua avalia????o"
                data-testid="product-detail-evaluation"
                name="evaluation"
                rows="5"
                cols="30"
                onChange={ this.handleEvaluationChange }
                value={ evaluation }
              />
            </label>
            <button
              type="submit"
              data-testid="submit-review-btn"
              disabled={ disabled }
              onClick={ this.handleSubmitClick }
            >
              Enviar Avalia????o!
            </button>
          </form>
          <div>
            <div>
              { evaluationSubmited ? (
                <div>
                  <h3>Email:</h3>
                  <p>{ evaluationSubmited[0] }</p>
                  <h3>Nota:</h3>
                  <p>{ evaluationSubmited[1] }</p>
                  <h3>Avalia????o:</h3>
                  <p>{ evaluationSubmited[2] }</p>
                </div>
              )
                : (
                  <span>
                    Produto sem avalia????es!
                  </span>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.cardConstructor()}
      </div>
    );
  }
}

Details.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default Details;
