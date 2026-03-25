interface ValidationErrors {
  fullname?: string
  email?: string
  password?: string
}

export const Validation = (
  email: string,
  password: string,
  fullname?: string
): ValidationErrors => {

  let errors: ValidationErrors = {}

  if (fullname !== undefined && !fullname) {
    errors.fullname = "Name is required"
  }

  if (!email) {
    errors.email = "Email is required"
  }

  if (!password) {
    errors.password = "Password is required"
  }

  return errors
}