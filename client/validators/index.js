

export const abn = value => value.replace(/ /g, '').length === 11;

export const email = value => (
  /^\+?\w+([+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
);

export const password = value => /\d/.test(value);

export const slug = value => /^[a-z0-9-]+$/.test(value);
