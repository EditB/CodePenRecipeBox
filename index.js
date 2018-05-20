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
class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Recipe Box</h1>
                <hr/>
                <AddRecipe addRecipe={this.props.addRecipe} />
                <hr/>
                <Recipes recipes={this.props.recipes} removeRecipe={this.props.removeRecipe}  />
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
                        <Recipe recipe={recipe}/>
                    </li>
                )}
            </ul>
        )
    }
}

class AddRecipe extends React.Component {
    handleSubmit(e) {
        // Stop page refreshing
        e.preventDefault();

        let refs = this.refs;
        let name = refs.name.value;
        let ingredients = refs.ingredients.value

        // Trigger action
        this.props.addRecipe(name, ingredients);

        // Reset form
        refs.addRecipe.reset();
    }
    render() {
        return (
            <div className="row">
                <div className="medium-6 medium-offset-3 columns">
                    <form ref="addRecipe" onSubmit={this.handleSubmit.bind(this)}>
                        <label for="name">Name</label>
                        <input id="name" type="text" ref="name" placeholder="Egg Sandwich" />
                        <label for="ingredients">Ingredients</label>
                        <input id="ingredients" type="text" ref="ingredients" placeholder="bread, egg, mayonese" />
                        <button type="submit" className="button">Add Recipe</button>
                    </form>
                </div>
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
