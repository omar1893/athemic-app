<template>
  <q-input :id="id" v-model="model" :type="type" :name="name" :label="label" :placeholder="placeholder" color="primary"
    bg-color="grey-2" label-color="accent" class="a-input body" outlined hide-bottom-space :autocomplete="autocomplete"
    :error="error" :error-message="errorMessage" :disable="disable" :readonly="readonly" :dense="dense"
    :clearable="clearable" :for="id">
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  name: string
  type?: 'number' | 'text' | 'search' | 'password' | 'textarea' | 'email' | 'tel' | 'file' | 'url' | 'time' | 'date' | 'datetime-local' | undefined
  label?: string
  placeholder?: string
  error?: boolean
  autocomplete?: string
  errorMessage?: string
  disable?: boolean
  readonly?: boolean
  dense?: boolean
  clearable?: boolean
}

withDefaults(defineProps<Props>(), {
  id: undefined,
  type: 'text',
  label: undefined,
  placeholder: undefined,
  autocomplete: 'off',
  error: false,
  errorMessage: '',
  disable: false,
  readonly: false,
  dense: false,
  clearable: true
})

const model = defineModel<string | number | null | undefined>()
</script>

<style lang="scss">
.a-input {
  .q-field__control {
    display: flex;
    min-height: 56px;
    padding: 16px 12px 16px 16px!important;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 16px!important;
    border: 1.5px solid rgba(23, 0, 51, 0.08);
    background: #FFF!important;
  }

  &.q-field--focused {
    .q-field__control {
      background: white;
    }
  }

  &.q-field--error {
    .q-field__bottom {
      padding: 4px 12px 0;
    }
  }
}
</style>