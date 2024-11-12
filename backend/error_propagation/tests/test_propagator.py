from django.test import TestCase
from error_propagation.error_propagator import (
    round_result,
    turn_to_one_sigfig,
    match_sigfigs,
    setup_df,
    validate_equation,
    propagate_errors,
)
from uncertainties import ufloat, UFloat
import pandas as pd
import math

class ErrorPropagatorTests(TestCase):
    def test_round_result(self):
        # test round_result function
        nom, err = round_result("1.23456", "0.05678")
        self.assertEqual(nom, "1.23")
        self.assertEqual(err, "0.06")

    def test_turn_to_one_sigfig(self):
        # test turn_to_one_sigfig function
        result = turn_to_one_sigfig("0.003423")
        self.assertEqual(result, "0.003")

    def test_match_sigfigs(self):
        # test match_sigfigs function
        result = match_sigfigs("1.23423", "0.008")
        self.assertEqual(result, "1.234")

    def test_setup_df(self):
        # test setup_df function
        data = {
            'variables': ['x', 'y'],
            'constErrors': [True, False],
            'nominalValues': ['1\n2\n3', '4\n5\n6'],
            'errorValuesVariable': ['', '0.1\n0.2\n0.3'],
            'errorValuesConstant': ['0.5', ''],
        }
        df = setup_df(data)
        self.assertIsInstance(df, pd.DataFrame)
        self.assertEqual(df.shape, (3, 2))
        self.assertIsInstance(df.iloc[0, 0], UFloat)

    def test_validate_equation(self):
        # test validate_equation function
        equation = "x + y"
        variables = ['x', 'y']
        result = validate_equation(equation, variables)
        self.assertEqual(result, equation)

        with self.assertRaises(ValueError):
            validate_equation("x + z", variables)

    def test_propagate_errors_simple(self):
        # test propagate_errors function with a simple equation
        data = {
            'variables': ['x', 'y'],
            'constErrors': [True, True],
            'nominalValues': ['1\n2', '3\n4'],
            'errorValuesVariable': ['', ''],
            'errorValuesConstant': ['0.1', '0.2'],
            'equation': 'x + y',
            'roundResult': True,
        }
        result, status = propagate_errors(data)
        self.assertEqual(status, 200)
        self.assertEqual(len(result['nominals']), 2)
        self.assertEqual(len(result['errors']), 2)

    def test_propagate_errors_complex(self):
        # test propagate_errors function with a more complex equation
        data = {
            'variables': ['x', 'y'],
            'constErrors': [False, False],
            'nominalValues': ['1\n2', '3\n4'],
            'errorValuesVariable': ['0.1\n0.2', '0.3\n0.4'],
            'errorValuesConstant': ['', ''],
            'equation': 'sin(x) * cos(y)',
            'roundResult': False,
        }
        result, status = propagate_errors(data)
        self.assertEqual(status, 200)
        self.assertEqual(len(result['nominals']), 2)
        self.assertEqual(len(result['errors']), 2)

    def test_propagate_errors_invalid_equation(self):
        # test propagate_errors function with an invalid equation
        data = {
            'variables': ['x', 'y'],
            'constErrors': [True, True],
            'nominalValues': ['1', '2'],
            'errorValuesVariable': ['', ''],
            'errorValuesConstant': ['0.1', '0.2'],
            'equation': 'x + z',  # 'z' is not a defined variable
            'roundResult': True,
        }
        result, status = propagate_errors(data)
        self.assertEqual(status, 500)
        self.assertIn("Bad equation", result)

    def test_propagate_errors_zero_division(self):
        # test propagate_errors function with zero division
        data = {
            'variables': ['x', 'y'],
            'constErrors': [True, True],
            'nominalValues': ['1', '0'],
            'errorValuesVariable': ['', ''],
            'errorValuesConstant': ['0.1', '0.1'],
            'equation': 'x / y',
            'roundResult': True,
        }
        result, status = propagate_errors(data)
        self.assertEqual(status, 500)
        self.assertIn("Zero division error", result)

    def test_propagate_errors_math_domain_error(self):
        # test propagate_errors function with math domain error
        data = {
            'variables': ['x'],
            'constErrors': [True],
            'nominalValues': ['-1'],
            'errorValuesVariable': [''],
            'errorValuesConstant': ['0.1'],
            'equation': 'sqrt(x)',
            'roundResult': True,
        }
        result, status = propagate_errors(data)
        self.assertEqual(status, 500)
        self.assertIn("Math domain error", result)