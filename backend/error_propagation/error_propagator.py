import numpy as np
import pandas as pd
import uncertainties as unc
from typing import List, Dict, Tuple
import math


def round_result(nom: str, err: str) -> Tuple[str, str]:
    """
    Round the error value to one significant figure and match the nominal value's last decimal place to the error's last decimal place.
    """
    err = turn_to_one_sigfig(err)
    nom = match_sigfigs(nom, err)
    return nom, err


def turn_to_one_sigfig(num: str) -> List[str]:
    """
    Takes a number as a string and returns the number with only one significant figure.

    For example, suppose we have a number as a string:
    num = '0.003423'

    Then we return,
    '0.003'
    """
    # TODO: implement this function
    return num


def match_sigfigs(num1: str, num2: str) -> str:
    """
    Return num1 rounded such that its last decimal corresponds to the same decimal place as num2.

    For example, suppose we have two numbers as strings:
    num1 = "1.23423"
    num2 = "0.008"

    Then we return "1.234"

    More examples:
    num1 = "4.56", num2 = "0.1" -> returns "4.6"
    num1 = "745.8233", num2 = "4" -> returns "746"
    num1 = "6.34", num2 = "0.0007" -> returns "6.3400"
    """
    # TODO: implement this function
    return num1


def setup_df(data) -> pd.DataFrame:
    """
    Takes the data from the frontend and sets up a pandas dataframe with the variables and their errors.
    """
    variables = data['variables']
    is_const_error = data['constErrors'] # bitmap of which variables are constants
    
    nominal_values = [data['nominalValues'][i].split('\n') for i in range(len(data['nominalValues']))]
    variable_errors = [data['errorValuesVariable'][i].split('\n') for i in range(len(data['errorValuesVariable']))]
    constant_errors = data['errorValuesConstant']

    # create a df to store the variables and their errors
    df = pd.DataFrame(columns=variables)

    # most be that each variable has the same number of nominal values 
    for i in range(len(nominal_values[0])):
        for j in range(len(variables)):
            if is_const_error[j]:
                df.loc[i, variables[j]] = unc.ufloat(float(nominal_values[j][i]), float(constant_errors[j]))
            else:
                df.loc[i, variables[j]] = unc.ufloat(float(nominal_values[j][i]), float(variable_errors[j][i]))
    return df


def validate_equation(equation: str, variables: List[str]) -> bool:
    """
    Validates that the equation is correct by checking that all the variables in the equation are in the list of variables. Also checks that the equation is a valid mathematical expression. If the equation is not valid, then an exception is raised.
    """
    equation = equation.replace('^', '**')
    for var in variables:
        if var not in equation:
            raise ValueError(f"Variable {var} is not in the equation.")
    return equation


def propagate_errors(data: Dict[str, list]) -> Tuple[Dict[str, List[str]], int]:
    """
    The backbone of the backend. This function takes the data from the views.py file as a dictionary and processes it. It returns a tuple of a dictionary: {"values": List[str], "errors": List[str]} and an integer representing the status code. If the status code is 200, then the processing was successful. Otherwise, the processing was not successful. The views.py file will then return a JsonResponse with the dictionary and status code.
    """
    # setup the dataframe
    df = setup_df(data)
    eqn = data['equation']
    roundingEnabled = data['roundResult']

    # parse the equation
    try:
        eqn = validate_equation(eqn, data['variables'])
    except Exception as e:
        return {f"Bad equation: {eqn}"}, 500

    allowed_functions = {
        'sin': math.sin,
        'cos': math.cos,
        'tan': math.tan,
        'log': math.log,
    'exp': math.exp,
        'sqrt': math.sqrt,
        'pi': math.pi,
        'e': math.e
    }
    
    vals, errs = [], []
    for i in range(df.shape[0]):
        vars = df.iloc[i].to_dict()
        
        # merge the vars and allowed_functions dictionaries
        try:
            result = eval(eqn, {"__builtins__": None}, {**vars, **allowed_functions})
        except Exception as e:
            return {f"Bad equation: {eqn}"}, 500
        n, s = str(result.n), str(result.s)
        if roundingEnabled:
            n, s = round_result(n, s)
        vals.append(n)
        errs.append(s)

    results = {"values": vals, "errors": errs}
    return results, 200
