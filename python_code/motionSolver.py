from sympy import symbols, sympify, Eq, solve
import json
import numpy as np
import sympy as sp

def converMatrixToEquation(row, variables):
    equation_parts = []
    n = len(variables)  # Number of variables

    for i in range(n):
        coef = row[i]
        if coef != 0:
            if coef == 1:
                equation_parts.append(f"{variables[i]}")
            elif coef == -1:
                equation_parts.append(f"-{variables[i]}")
            else:
                equation_parts.append(f"{coef}{variables[i]}")

    rhs = row[-1]

    equation_lhs = " + ".join(equation_parts).replace("+ -", "- ")
    equation = f"{equation_lhs} = {rhs}"

    return equation


def row_reduce(matrix, default_equations, string_variables):
    m, n = matrix.shape
    reduced_matrix = np.copy(matrix)
    path = []
    for i in range(m):
        path.append(f"We will denote the equation: {default_equations[i]} as equation {i + 1}")
    lead = 0
    for r in range(m):
        if lead >= n:
            break
        i = r
        while reduced_matrix[i, lead] == 0:
            i += 1
            if i == m:
                i = r
                lead += 1
                if lead == n:
                    break
        reduced_matrix[[r, i]] = reduced_matrix[[i, r]]
        if reduced_matrix[r, lead] != 0:
            if r != i:
                equationR = converMatrixToEquation(reduced_matrix[r], string_variables)
                equationI = converMatrixToEquation(reduced_matrix[i], string_variables)
                path.append(f"We will denote the equation: {equationR} as equation {r + 1}\n"
                            f"and denote the equation: {equationI} as equation {i + 1}")

        lv = reduced_matrix[r, lead]
        reduced_matrix[r] = reduced_matrix[r] / lv
        if not (lv == 1):
            path.append(f"We will divide equation {r + 1} by {lv}")

        for i in range(m):
            if i != r:
                lv = reduced_matrix[i, lead]
                reduced_matrix[i] -= lv * reduced_matrix[r]
                if lv != 0:
                    path.append(f"Subtract equation {r + 1} from equation {i + 1} {lv} times")
        lead += 1

    return reduced_matrix, path


def reformat_equations(equation_list):
    variables = set()
    for eq in equation_list:
        parser(eq, variables)
    variables = list(variables)
    string_variables = [str(var) for var in variables]
    string_variables.sort()
    return variables, string_variables


def parser(equation, variables):
    sides = equation.split('=')

    for side in sides:
        expr = sympify(side)
        variables_side = expr.free_symbols
        variables.update(variables_side)


def equations_to_matrix_equation(equation_list, variables):
    num_variables = len(variables)
    num_equations = len(equation_list)

    coefficient_matrix = np.zeros((num_equations, num_variables))
    constant_vector = np.zeros((num_equations, 1))

    for i, eq_str in enumerate(equation_list):
        lhs, rhs = eq_str.split('=')
        lhs = lhs.strip()
        rhs = rhs.strip()

        expr_lhs = sympify(lhs)
        for j, var in enumerate(variables):
            coefficient_matrix[i, j] = expr_lhs.coeff(var)

        expr_rhs = sympify(rhs)
        if expr_rhs.is_number:
            constant_vector[i, 0] = expr_rhs
        else:
            terms = expr_rhs.as_ordered_terms()
            for term in terms:
                print(term)
                coef = term.coeff(var)
                if coef is None:
                    constant_vector[i, 0] += -term
                else:
                    constant_vector[i, 0] += -coef * var

    matrix_equation = np.hstack((coefficient_matrix, constant_vector))
    return matrix_equation


def extract_solution(reduced_matrix, variables):
    solution = {}
    m, n = reduced_matrix.shape
    for col in range(n - 1):
        leading_row = None
        for row in range(m):
            if reduced_matrix[row, col] == 1:
                leading_row = row
                break
        if leading_row is not None:
            solution[variables[col]] = reduced_matrix[leading_row, -1]
        else:
            solution[str(col)] = None
    return solution


def rearrange_equations(unsimplified_equations):
    rearranged_eqs = []

    for eq in unsimplified_equations:
        lhs, rhs = eq.split('=')

        lhs_expr = sp.sympify(lhs)
        rhs_expr = sp.sympify(rhs)

        full_expr = lhs_expr - rhs_expr

        simplified_expr = sp.simplify(full_expr)

        variables = simplified_expr.as_ordered_terms()
        const = sum(term for term in variables if term.is_constant())
        variables = [term for term in variables if not term.is_constant()]

        left_side = sum(variables)
        right_side = -const

        print(f"{left_side} = {right_side}")
        final_eq = f"{left_side} = {right_side}"
        rearranged_eqs.append(final_eq)

    return rearranged_eqs


def motion_solver(equations):
    starting_string = "We will rearrange the equations:\n"
    for eq in equations:
        starting_string += eq
        starting_string += "\n"
    starting_string += "To the equations:\n"
    equations = rearrange_equations(equations)
    for eq in equations:
        starting_string += eq
        starting_string += "\n"
    variables, string_variables = reformat_equations(equations)
    matrix1 = equations_to_matrix_equation(equations, variables)
    reduced_matrix, path = row_reduce(matrix1, equations, string_variables)
    path.insert(0, starting_string)
    for step in path:
        print(step)

    final_solution = extract_solution(reduced_matrix, variables)
    path.append(f"We get that the solution is: {final_solution}")
    return path


print(motion_solver(["x+z=5", "2*z-3*x=0", "2*y+x=4"]))
