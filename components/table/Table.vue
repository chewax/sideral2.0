<template>
  <div>
    <Pagination :id="id" class="hide-mobile">
      <span v-if="selectedItems.length > 0" class="mr-4">
        <span v-for="action in modelItems[0].actions" :key="action.action">
          <b-button
            v-if="action.type === 'action' && action.addToBulk"
            v-b-tooltip.hover
            :title="`${action.name} selected`"
            :disabled="
              ($nuxt.$loading && $nuxt.$loading.show) || action.disabled
            "
            variant="light"
            :class="`${action.class} p-0 mr-3` "
            @click="onBulkActionClick(action)"
          >
            <b-icon :icon="action.icon" />
          </b-button>
        </span>
      </span>
    </Pagination>

    <b-table
      :id="id"
      :ref="`ref_${id}`"
      striped
      hover
      :items="modelItems"
      :fields="modelFields"
      :busy="modelBusy"
      :selectable="false"
      responsive
      @row-clicked="onRowClicked"
    >
      <template #head(check)>
        <b-form-checkbox :checked="allSelected" size="lg" @change="onSelectAll" />
      </template>

      <template #table-busy>
        <div class="text-center my-2">
          <b-spinner class="align-middle mr-2" />
          <strong>Loading...</strong>
        </div>
      </template>

      <template #cell(check)="data">
        <b-form-checkbox
          :checked="isSelected(data.item)"
          size="lg"
          @change="onSelectRow($event, data)"
        />
      </template>

      <template #cell(tags)="data">
        <b-badge
          v-for="tag in data.value"
          :key="tag"
          class="ml-1"
          :variant="tag.variant || 'accent'"
        >
          {{ tag }}
        </b-badge>
      </template>

      <template #cell(created_at)="{item}">
        <div class="w-100 d-flex flex-column justify-content-center align-items-start">
          <span class="field-master">{{ formatDate(item.created_at).date }}</span>
          <span class="field-detail">{{ formatDate(item.created_at).fromNow }}</span>
        </div>
      </template>

      <template #cell(custom_id)="{item}">
        <b>{{ item.custom_id }}</b>
      </template>

      <template #cell(actions)="data">
        <b-dropdown variant="clear" no-caret boundary="viewport">
          <template #button-content>
            <b-icon icon="three-dots-vertical" variant="primary" class="cursor-auto" />
          </template>

          <span v-for="action in data.value" :key="action.action">
            <b-dropdown-item
              v-if="action.type === 'action'"
              :disabled="
                ($nuxt.$loading && $nuxt.$loading.show) || action.disabled
              "
              @click="onActionClick(action, data)"
            >
              <div :class="`d-flex justify-content-between ${action.class}`">
                <b-icon :icon="action.icon" />
                {{ action.name }}
              </div>
            </b-dropdown-item>

            <b-dropdown-divider v-if="action.type === 'divider'" />
            <b-dropdown-header v-if="action.type === 'header'">
              {{ action.title }}
            </b-dropdown-header>
          </span>
        </b-dropdown>
      </template>
    </b-table>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Array,
      default: () => []
    },
    busy: {
      type: Boolean,
      default: false
    },
    actions: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    modelItems: [],
    modelFields: [],
    modelBusy: false,
    selectedItems: []
  }),

  computed: {
    allSelected () {
      return this.selectedItems.length === this.modelItems.length;
    }
  },

  watch: {
    items (val) {
      this.modelItems = val;
    },
    busy (val) {
      this.modelBusy = val;
    }
  },

  mounted () {
    this.modelItems = this.items;
    this.modelFields = this.mixinFields(this.fields);
    this.modelBusy = this.busy;
  },

  methods: {
    isSelected (item) {
      const idx = this.selectedItems.findIndex(i => i._id === item._id);
      return idx !== -1
    },

    formatDate (date) {
      moment.locale(this.$i18n.locale);
      return {
        date: moment(date).format('DD MMM YYYY'),
        time: moment(date).format('HH:mm'),
        fromNow: moment(date).fromNow()
      }
    },
    onActionClick (action, item) {
      this.$emit('actionClick', action, item);
    },

    onBulkActionClick (action) {
      this.$emit('bulkActionClick', action, this.selectedItems);
    },

    onRowSelected (selected) {
      this.selectedItems = selected;
      this.allSelected = this.selectedItems.length === this.modelItems.length;
    },

    onRowClicked (row) {
      this.$emit('rowClick', row);
    },

    onSelectRow (evt, { item }) {
      if (evt) {
        this.selectedItems.push(item)
      } else {
        const idx = this.selectedItems.findIndex(i => i._id === item._id);
        if (idx !== -1) { this.selectedItems.splice(idx, 1); }
      }
    },

    selectAllRows () {
      this.selectedItems = [...this.modelItems];
    },

    clearSelected () {
      this.selectedItems = [];
    },

    onSelectAll (evt) {
      evt ? this.selectAllRows() : this.clearSelected();
    },

    mixinFields (fields) {
      return [
        {
          key: 'check',
          label: ''
        },
        ...fields
      ];
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/style/modules/_colors.scss";
@import "@/assets/style/modules/_constants.scss";
  $pad: 30px;

  .cursor-auto {
    cursor: auto !important;
  }

  table > tbody > tr {
    cursor: pointer;
  }

  table > thead > tr > th:first-child {
    padding-left: $pad;
  }

  table > thead > tr > th:last-child {
    padding-right: $pad;
  }

  table > tbody > tr > td:first-child {
    padding-left: $pad;
  }

  table > tbody > tr > td:last-child {
    padding-right: $pad;
  }

  .field-detail {
    color: darken($color_background, 25);
    font-size: 0.85em;
  }
</style>
