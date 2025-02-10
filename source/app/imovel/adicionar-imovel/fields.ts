export const inputs = [
  {
    name: "nickname",
    label: "Apelido",
    type: "text",
    placeholder: "Apelido do imóvel",
    description: "Apelido ou nome alternativo para o imóvel",
  },
  {
    name: "type",
    type: "text",
    label: "Tipo",
    placeholder: "Tipo de imóvel (ex: apartamento, casa, sala comercial)",
    description: "Tipo de imóvel (ex: apartamento, casa, sala comercial)",
  },
  {
    name: "registration",
    label: "Matricula:",
    type: "text",
    placeholder: "Matricula",
    description: "Matricula do imóvel",
  },
  {
    name: "scripture",
    label: "Escritura:",
    type: "text",
    placeholder: "Escritura",
    description: "Escritura do imóvel",
  },
  {
    name: "registrationCertification",
    label: "Certidão de Registro:",
    type: "text",
    placeholder: "Certidão de Registro",
    description: "Certidão de Registro",
  },
  {
    name: "address",
    label: "Endereço",
    type: "text",
    placeholder: "Endereço do imóvel",
    description: "Endereço completo do imóvel",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "",
    description: "Status",
  },
  {
    name: "paymentDay",
    label: "Dia de Pagamento",
    type: "number",
    placeholder: "Dia de pagamento do aluguel",
    description: "Dia do mês em que o aluguel é pago",
  },
  {
    name: "paymentLocation",
    label: "Local de Pagamento",
    type: "text",
    placeholder: "Local onde o aluguel é pago",
    description: "Local onde o aluguel é pago (ex: banco, aplicativo, etc)",
  },
  {
    name: "unoccupied",
    label: "Desocupado desde:",
    type: "dateDes",
    description: "Data do inicio da desocupação do imóvel",
  },
  {
    name: "numOfRooms",
    label: "Número de Quartos",
    type: "number",
    placeholder: "Número de quartos do imóvel",
    description: "Número total de quartos no imóvel",
  },
  {
    name: "cleaningIncluded",
    label: "Limpeza Incluída",
    type: "checkbox",
    description: "Se a limpeza está incluída no aluguel",
  },
  {
    name: "elevator",
    label: "Elevador",
    type: "checkbox",
    description: "Se o imóvel possui elevador",
  },
  {
    name: "garage",
    label: "Garagem",
    type: "checkbox",
    description: "Se o imóvel possui garagem",
  },
  {
    name: "contractWith",
    label: "Contrato com",
    type: "text",
    placeholder: "Nome ou entidade com quem o contrato foi feito",
    description: "Nome ou entidade com quem o contrato de aluguel foi feito",
  },
  {
    name: "startDate",
    label: "Data de Início",
    type: "date",
    description: "Data de início do contrato de aluguel",
  },
  {
    name: "endDate",
    label: "Data de Término",
    type: "date",
    description: "Data de término do contrato de aluguel",
  },
  {
    name: "readjustmentIndex",
    label: "Índice de Reajuste",
    type: "text",
    placeholder: "Índice utilizado para reajuste do aluguel",
    description: "Índice utilizado para reajuste do aluguel (ex: IPCA, IGPM)",
  },
  {
    name: "administrator",
    label: "Administrador",
    type: "text",
    placeholder: "Nome do administrador do imóvel",
    description: "Nome do administrador do imóvel (proprietário ou empresa)",
  },
  {
    name: "admistratorPhoneNumber",
    label: "Telefone do Administrador",
    type: "tel",
    placeholder: "(XX) XXXX-XXXX",
    description: "Telefone do administrador do imóvel",
  },
  {
    name: "admistratorEmail",
    label: "Email do Administrador",
    type: "email",
    placeholder: "email@dominio.com",
    description: "Email do administrador do imóvel",
  },
  {
    name: "administrateTax",
    label: "Taxa de Administração",
    type: "text",
    placeholder: "Taxa de administração do imóvel",
    description: "Taxa de administração do imóvel (caso aplicável)",
  },
  {
    name: "lessee",
    label: "Locatário",
    type: "text",
    placeholder: "Nome do locatário",
    description: "Nome do locatário do imóvel",
  },
  {
    name: "lesseePhone",
    label: "Telefone do Locatário",
    type: "tel",
    placeholder: "(XX) XXXX-XXXX",
    description: "Telefone do locatário do imóvel",
  },
  {
    name: "optionalContactName",
    label: "Nome do Contato Opcional",
    type: "text",
    placeholder: "Nome do contato opcional",
    description: "Nome do contato opcional para o imóvel",
  },
  {
    name: "optionalContactNumber",
    label: "Telefone do Contato Opcional",
    type: "tel",
    placeholder: "(XX) XXXX-XXXX",
    description: "Telefone do contato opcional para o imóvel",
  },
  {
    name: "guarantor",
    label: "Fiador",
    type: "text",
    placeholder: "Nome do fiador",
    description: "Nome do fiador do contrato de aluguel",
  },
  {
    name: "guarnatorData",
    label: "Dados do Fiador",
    type: "text",
    placeholder: "Dados do fiador (ex: CPF, RG)",
    description: "Dados do fiador do contrato de aluguel (ex: CPF, RG)",
  },
  {
    name: "guarantorNumber",
    label: "Telefone do Fiador",
    type: "tel",
    placeholder: "(XX) XXXX-XXXX",
    description: "Telefone do fiador do contrato de aluguel",
  },
  {
    name: "condominium",
    label: "Condomínio",
    type: "price",
    placeholder: "Valor do condomínio",
    description: "Valor do condomínio (caso aplicável)",
  },
  {
    name: "IPTU",
    label: "IPTU",
    type: "text",
    placeholder: "é isento de IPTU ou é pagante",
    description:
      "Valor do IPTU (Imposto sobre a Propriedade Predial e Territorial Urbana)",
  },
  {
    name: "rentValue",
    label: "Aluguel",
    type: "price",
    placeholder: "Valor do Aluguel",
    description: "Valor do Aluguel",
  },
  {
    name: "taxIPTU",
    label: "Valor do IPTU",
    type: "price",
    placeholder: "Valor do IPTU",
    description: "Valor do IPTU",
  },
  {
    name: "gas",
    label: "Valor do Gás",
    type: "price",
    placeholder: "Valor do Gás",
    description: "Valor do Gás",
  },
  {
    name: "light",
    label: "Valor da conta de Luz",
    type: "price",
    placeholder: "Valor da conta de Luz",
    description: "Valor da conta de Luz",
  },
  {
    name: "lightInformation",
    label: "Informações da conta de Luz",
    type: "text",
    placeholder: "Telefone, obs...",
    description: "Informações da conta de Água",
  },
  {
    name: "water",
    label: "Valor da conta de Água",
    type: "price",
    placeholder: "Valor da conta de Água",
    description: "Valor da conta de Água",
  },
  {
    name: "waterInformation",
    label: "Informações da conta de Água",
    type: "text",
    placeholder: "Telefone, obs...",
    description: "Informações da conta de Água",
  },
  {
    name: "contractRegistration",
    label: "Registro de contato",
    type: "text",
    placeholder: "Registro de contato",
    description: "Registro de contato",
  },
  {
    name: "insurance",
    label: "Seguro",
    type: "text",
    placeholder: "Seguro",
    description: "Seguro",
  },
  {
    name: "signatureRecognition",
    label: "Reconhecimento firmas do contrato",
    type: "text",
    placeholder: "Reconhecimento firmas do contrato",
    description: "Reconhecimento firmas do contrato",
  },
  {
    name: "lawyer",
    label: "Advogado",
    type: "text",
    placeholder: "Nome do advogado",
    description: "Nome do advogado",
  },
  {
    name: "lawyerData",
    label: "Dados do advogado",
    type: "text",
    placeholder: "Telefone, email...",
    description: "Dados do advogado",
  },
  {
    name: "proprietary",
    label: "Proprietário",
    type: "text",
    placeholder: "Nome do proprietário",
    description: "Nome do proprietário",
  },
  {
    name: "beforePhoto",
    label: "Fotografias antes da entrada",
    type: "photo",
    placeholder: "Upload",
    description: "Fotografias antes da entrada",
  },
  {
    name: "afterPhoto",
    label: "Fotografias antes da saída",
    type: "photo",
    placeholder: "Upload",
    description: "Fotografias antes da saída",
  },
  {
    name: "observation",
    label: "Observações",
    type: "textarea",
    placeholder: "Observações sobre o imóvel",
    description: "Observações adicionais sobre o imóvel",
  },
];
