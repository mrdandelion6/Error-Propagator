import numpy as np
import pandas as pd
import uncertainties as unc
from typing import List
import math


def turn_to_one_sigfig(nums: List[str]) -> List[str]:
    """
    Takes a list of numbers as strings and returns a list of the same numbers with only one significant figure.

    For example, suppose we have a list of numbers as strings:
    nums = ['0.003423', '4.56', '745.8233', '6.34']

    Then we return,
    ['0.003', '5', '700', '6']
    """
    for i in range(len(nums)):
        nums[i] = float(nums[i])
        nums[i] = round(nums[i], 1)
    return nums


def match_sigfigs(nums1: List[str], nums2: List[str]) -> List[str]:
    """
    Return a list with all the floats in nums1 rounded such that their last decimal corresponds to the same decimal place as the corresponding float in nums2.

    For example, suppose we have two lists of floats:
    nums1 = [1.23423, 4.56, 745.8233, 6.34]
    nums2 = [0.008, 0.1, 4, 0.0007]

    Then we return,
    [1.234, 4.6, 746, 6.3400]

    """
    pass


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
    Validates that the equation is correct by checking that all the variables in the equation are in the list of variables. Also checks that the equation is a valid mathematical expression.
    """
    equation = equation.replace('^', '**')


def propagate_errors(data) -> dict:
    # setup the dataframe
    df = setup_df(data)
    eqn = data['equation']

    # parse the equation
    eqn = eqn.replace('^', '**')

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
    
    results = []
    for i in range(df.shape[0]):
        vars = df.iloc[i].to_dict()
        
        # merge the vars and allowed_functions dictionaries
        result = eval(eqn, {"__builtins__": None}, {**vars, **allowed_functions})
        results.append(result)

    df['result'] = results
    print(df)

    return 0
