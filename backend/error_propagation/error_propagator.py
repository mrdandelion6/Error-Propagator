import numpy as np
import pandas as pd
import uncertainties as unc
from typing import List


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

def setup_df(data) -> pd.DataFrame:
    equation = data['equation']
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
                df.loc[i, variables[j]] = unc.ufloat(nominal_values[j][i], constant_errors[j])
            else:
                df.loc[i, variables[j]] = unc.ufloat(nominal_values[j][i], variable_errors[j][i])
    print(df)
    return df

def propagate_errors(data) -> dict:
    # setup the dataframe
    df = setup_df(data)

    return 0
