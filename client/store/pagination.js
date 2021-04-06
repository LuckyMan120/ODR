

export const mixinState = () => ({
  limit: 10,
  currentPage: 1,
  count: 0,
  data: [],
  sort: 'id ASC',
  where: {},
  search: ''
});

export const mixinGetters = () => ({
  where: state => state.where,
  limit: state => state.limit,
  currentPage: state => state.currentPage,
  count: state => state.count,
  data: state => state.data,
  search: state => state.search
});

export const mixinMutations = () => ({
  limit: (state, limit) => state.limit = limit,
  count: (state, count) => state.count = count,
  data: (state, data) => state.data = data,
  currentPage: (state, page = 1) => state.currentPage = page,
  where: (state, where = {}) => state.where = where,
  sort: (state, sort = 'id DESC') => state.sort = sort,

  search: (state, {search, fields}) => {
    if (search) {
      state.search = search;
      state.where.or = fields.map(field => ({[field]: {contains: search}}));
    } else {
      const {
        or, // eslint-disable-line
        ...where
      } = state.where;
      state.search = '';
      state.where = where;
    }
  }
});

export const mixinActions = () => ({
  async fetch() {
    throw new Error('TODO: IMPLEMENT ME');
  },

  async setSort({commit, dispatch}, {sortBy, sortDesc = false}) {
    if (!sortBy) return;
    let sort = sortBy;
    if (sortDesc) {
      sort += ' DESC';
    } else {
      sort += ' ASC';
    }
    commit('sort', sort);
    await dispatch('fetch');
  }
});
