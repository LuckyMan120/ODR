<template>
  <div>
    <b-row
      v-if="excel || searchFields.length"
      class="mb-1"
    >
      <b-col
        v-if="searchFields.length"
        cols="6"
        align="left"
      >
        <Search
          :fields="searchFields"
          :identity="identity"
        />
      </b-col>
      <b-col
        v-if="excel"
        cols="6"
        align="right"
      >
        <button
          :disabled="items.length ? false : true"
          class="btn btn-outline-primary mb-1"
          @click="_export"
        >
          {{ $t('exportExcel') }}
        </button>
      </b-col>
    </b-row>
    <b-table
      striped
      hover
      responsive
      :fields="fields"
      :items="items"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template #cell(boolean)="row">
        <TableBoolean
          :value="row.value"
          :identity="identity"
        />
      </template>
      <template #cell(actions)="row">
        <TableActions :actions="row.value" />
      </template>

      <template
        v-for="slot in slots"
        #[`cell(${slot})`]="row"
      >
        <slot
          :name="slot"
          :data="row"
        />
      </template>

      <template #cell(relation)="row">
        <TableRelation
          v-if="row.value"
          :link="row.value.link"
          :text="row.value.text"
          :target="row.value.target"
          :outbound="row.value.outbound"
        />
      </template>
    </b-table>
    <b-row v-if="!items.length">
      <b-col
        cols="12"
        align="center"
      >
        <b-alert
          show
        >
          {{ $t(noItemsMessage) }}
        </b-alert>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import XLSX from 'xlsx';
export default {
  props: {
    slots: {type: Array, default: () => ([])},
    fields: {type: Array, default: () => ([])},
    items: {type: Array, default: () => ([])},
    identity: {type: String, default: ''},
    searchFields: {type: Array, default: () => ([])},
    excel: {type: Boolean, default: false},
    noItemsMessage: {type: String, default: 'defaultNoItems'}
  },
  data: () => ({
    sortBy: '',
    sortDesc: false
  }),
  watch: {
    sortBy() {
      this.$store.dispatch(this.identity + '/setSort', {
        sortBy: this.sortBy,
        sortDesc: this.sortDesc
      });
    },
    sortDesc() {
      this.$store.dispatch(this.identity + '/setSort', {
        sortBy: this.sortBy,
        sortDesc: this.sortDesc
      });
    }
  },
  methods: {
    getCsvRows() {
      const filteredFields = this.fields.filter((field) => {
        return field.key !== 'actions';
      });
      const rows = [];
      const headers = [];
      filteredFields.forEach((field) => {
        headers.push(field.label);
        this.items.forEach((item, index) => {
          if (!(rows[index])) {
            rows[index] = [];
          }
          rows[index].push(item[field.key]);
        });
      });
      rows.unshift(headers);
      return rows;
    },
    _export() {
      /* convert state to workbook */
      const ws = XLSX.utils.aoa_to_sheet(this.getCsvRows());
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
      /* generate file and send to client */
      XLSX.writeFile(wb, 'sheetjs.xlsx');
    }
  }
};
</script>
