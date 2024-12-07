import * as yup from "yup";

initialValues = {
  nome: "",
  sobrenome: "",
  senha: "",
  senhaConfirm: "",
};

validationSchema = {
  nome: yup.string().required("Nome é obrigatório"),
  sobrenome: yup.string().required("Sobrenome é obrigatório"),
  senha: yup
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
  senhaConfirm: yup
    .string()
    .oneOf([yup.ref("senha"), null], "Senhas não coincidem")
    .required("Confirmação de senha é obrigatória"),
};

export { initialValues, validationSchema };
