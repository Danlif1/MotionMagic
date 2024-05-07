from sympy import symbols, sympify
from sympy import Eq, solve


def motion_solver(equation_list):
    variables, string_variables = reformat_equations(equation_list)
    print(solve_equations(equation_list, variables, string_variables))
    print(variables)


def solve_equations(equations, variables, string_variables):
    # Initialize an empty dictionary to store parameters
    params = {}

    # Initialize an empty list to store equations
    sympy_eqs = []

    # Create symbolic variables for the parameters
    sym_variables = symbols(string_variables)

    # Loop through each equation in the list
    for eq_str in equations:
        # Split equation into left and right sides
        lhs, rhs = eq_str.split('=')

        # Strip any leading/trailing whitespaces
        lhs = lhs.strip()
        rhs = rhs.strip()

        # Convert the equation string into a Sympy equation object
        sympy_eq = Eq(sympify(lhs), sympify(rhs))

        # Add the equation to the list
        sympy_eqs.append(sympy_eq)

    # Solve the system of equations
    solution = solve(sympy_eqs, dict=True)

    # Update the parameters dictionary with the solved values
    for sol in solution:
        params.update(sol)

    return params


def reformat_equations(equation_list):
    variables = set()
    for eq in equation_list:
        parser(eq, variables)
    variables = list(variables)
    string_variables = []
    for var in variables:
        string_variables.append(str(var))
    string_variables.sort()
    return variables, string_variables


def parser(equation, variables):
    # Split the equation at the equals sign
    sides = equation.split('=')

    for side in sides:
        # Convert the side of the equation string into a SymPy expression
        expr = sympify(side)

        # Get the variables from the expression
        variables_side = expr.free_symbols

        # Extend the variables list with the variables from this side
        variables.update(variables_side)


equations = [
    "x + y + w = 10",
    "2*x - y + z = 5"
]
motion_solver(equations)
