const {
    createStore,
    bindActionCreators
} = Redux;
const {
    Provider,
    connect
} = ReactRedux;
const {
    render
} = ReactDOM;

// Sample data for RecipeBox
const recipeList = [{
    name: 'Spagetti',
    ingredients: 'pasta, pasta sauce',
    id: uuid.v4()
}, {
    name: 'Chocolate Cake',
    ingredients: 'egg, flour, chocolate, sugar',
    id: uuid.v4()
}, {
    name: 'Cucumber Sandwiches',
    ingredients: 'bread, butter, cucumber',
    id: uuid.v4()
}, {
    name: 'scrambled eggs',
    ingredients: 'eggs, oil',
    id: uuid.v4()
}, ];


/* --- COMPONENTS --- */

class Form extends React.Component {
  handleSubmit(e) {
        // Stop page refreshing
        e.preventDefault();
 let refs = this.refs;
      // Trigger action
     if (this.props.text == "Add Recipe"){

        let name = refs.name.value;
        let ingredients = refs.ingredients.value
        this.props.addRecipe(name, ingredients);
// Reset form
        refs.addRecipe.reset();
        }
    else{

         let index = this.props.index;
      let name = refs.name.value;
        let ingredients = refs.ingredients.value
        this.props.editRecipe(index, name, ingredients);
    }



      this.props.closePopup();
    }
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
          <form  onSubmit={this.handleSubmit.bind(this)}>
                        <label for="name">Name</label>
                        <input id="name" type="text" ref="name" placeholder="Egg Sandwich" defaultValue={this.props.name} />
                        <label for="ingredients">Ingredients</label>
                        <input id="ingredients" type="text" ref="ingredients" placeholder="bread, egg, mayonese" />
                        <button type="submit" className="button">{this.props.text}</button>
                    </form>

        <button onClick={this.props.closePopup}>Cancel</button>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showPopup: false
    };
  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
    render() {
        return (
            <div>
                <h1>Recipe Box</h1>
                <hr/>
                <button onClick={this.togglePopup.bind(this)}>Add Recipe</button>
                <hr/>
             {this.state.showPopup ?
          <Form
            text='Add Recipe'
            addRecipe={this.props.addRecipe}
            closePopup={this.togglePopup.bind(this)}
          />
          : null
        }
                <Recipes recipes={this.props.recipes} removeRecipe={this.props.removeRecipe}  editRecipe={this.props.editRecipe} togglePopup={this.togglePopup.bind(this)} showPopup={this.state.showPopup} />
            </div>
        )
    }
}

class Recipes extends React.Component {

    render() {

        return (
            <ul className="recipes">
                {this.props.recipes.map((recipe, index) =>
                    <li className="recipes__recipe" key={index}>
                        <Recipe recipe={recipe} removeRecipe={this.props.removeRecipe} editRecipe={this.props.editRecipe} index={index} togglePopup={this.props.togglePopup} showPopup={this.props.showPopup} />
                    </li>
                )}
            </ul>
        )
    }
}

class AddRecipe extends React.Component {

    render() {
        return (
            <div className="row">
                <div className="medium-6 medium-offset-3 columns">

                </div>
            </div>
        )
    }
}

class EditRecipe extends React.Component {
    handleOnClick() {
        let index = this.props.index;

        this.props.editRecipe(index);
    }
    render() {
        return (
<div>

  </div>
        )
    }
}

class RemoveRecipe extends React.Component {
    handleOnClick() {
        let index = this.props.index;

        this.props.removeRecipe(index);
    }
    render() {
        return (

            <button className="alert button tiny" onClick={this.handleOnClick.bind(this)}> &times; Remove Recipe</button>
        )
    }
}

class Recipe extends React.Component {
state = { showing: false };
    render() {
     const { showing } = this.state;

        return (
            <div className="recipeBox" >
                <p className="recipe_name" onClick={() => this.setState({ showing: !showing })}>{this.props.recipe.name}</p>
            <p className="ingredients" style={{ display: (showing ? 'block' : 'none') }}><h3>Ingredients</h3>
              {this.props.recipe.ingredients}
              <br /><br />
  <RemoveRecipe removeRecipe={this.props.removeRecipe} index={this.props.index} />

              <button onClick={this.props.togglePopup}>Edit Recipe</button>
              <hr />
             {this.props.showPopup ?
          <Form
            text='Edit Recipe'
            editRecipe={this.props.editRecipe}
            closePopup={this.props.togglePopup}
            index={this.props.index}
          />
          : null
        }

            </p>
            </div>

        )
    }
}


/* --- REDUCERS --- */
function reducer(state = [], action) {
     switch (action.type) {
        case 'ADD_RECIPE':
            // Return a new array with old state and added attendee.
            return [{
                    name: action.name,
                    ingredients: action.ingredients
                },
                ...state
            ];
        case 'EDIT_RECIPE':
         console.log("action.index: " + action.index);
               console.log("action");
         console.log(action);
    obj2={ingredients: action.ingredients, name: action.name};

            return [
              ...state.slice(0, action.index),
               Object.assign({}, ...state, obj2),
   ...state.slice(action.index + 1)
            ];
        case 'REMOVE_RECIPE':
            return [
                // Grab state from begging to index of one to delete
                ...state.slice(0, action.index),
                // Grab state from the one after one we want to delete
                ...state.slice(action.index + 1)
            ];
        default:
            return state;
    }
};

/* --- ACTIONS --- */

const actions = {
    addRecipe: (name, ingredients) => {
        return {
            type: 'ADD_RECIPE',
            id: uuid.v4(),
            name,
            ingredients
        }
    },
   editRecipe: (index, name, ingredients) => {
        return {
            type: 'EDIT_RECIPE',
            index,
            name,
            ingredients
        }
    },
    removeRecipe: (index) => {
        return {
            type: 'REMOVE_RECIPE',
            index
        }
    }
};


/* --- STORE --- */

const AppContainer = connect(
    function mapStateToProps(state) {
        return {
            recipes: state
        };
    },
    function mapDispatchToProps(dispatch) {
        return bindActionCreators(actions, dispatch);
    }
)(App);

const store = createStore(reducer, recipeList);

/* --- OTHER --- */

// Render the app
render(
    <Provider store={store}>
    <AppContainer />
  </Provider>,
    document.getElementById('app')
);
