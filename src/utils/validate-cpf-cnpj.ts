export function validateCPFCNPJ(cpfOrCnpj: string) {
  if (typeof cpfOrCnpj !== 'string') return false;
  const cleanCPF_CNPJ = cpfOrCnpj.replace(/[^\d]+/g, '');

  if (cleanCPF_CNPJ.length === 11) {
    return validateCPF(cleanCPF_CNPJ);
  }
  else if (cleanCPF_CNPJ.length === 14) {
    return validateCNPJ(cleanCPF_CNPJ);
  }
}

function validateCPF(cpf: string) {
  if (cpf.length !== 11) return false;

  let sum = 0;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  let remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cpf.substring(9,10))) return false;

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function validateCNPJ(cnpj: string) {
  if (cnpj.length !== 14) return false;

  let sum = 0;
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  let digits = cnpj.substring(size);

  let position = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * position--;

    if (position < 2) position = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  position = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * position--;

    if (position < 2) position = 9;
  }

  result = sum % 11 < 2 ? 0: 11 - (sum % 11);

  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}
