from sympy import symbols, sympify
from sympy import Eq, solve


def motion_solver(equation_list):
    variables, string_variables = reformat_equations(equation_list)
    return solve_equations(equation_list, string_variables)


def solve_equations(_equations, string_variables):
    params = {}

    sympy_eqs = []

    sym_variables = symbols(string_variables)

    for eq_str in _equations:
        lhs, rhs = eq_str.split('=')

        lhs = lhs.strip()
        rhs = rhs.strip()

        sympy_eq = Eq(sympify(lhs), sympify(rhs))

        sympy_eqs.append(sympy_eq)

    solution = solve(sympy_eqs, dict=True)

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
    sides = equation.split('=')

    for side in sides:
        expr = sympify(side)

        variables_side = expr.free_symbols

        variables.update(variables_side)


equations = [
    "x+y+w=10",
    "2*x-y+z=5",
    "17*y/z=13*w",
    "w^2=3"
]
motion_solver(equations)
