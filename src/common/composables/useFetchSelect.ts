type OptionValue = string | number;

/** Data format required by Select */
interface SelectOption {
  value: OptionValue;
  label: string;
  disabled?: boolean;
}

/** API response format */
type ApiData = ApiResponseData<SelectOption[]>;

/** Parameter format, currently only the api function needs to be passed */
interface FetchSelectProps {
  api: () => Promise<ApiData>;
}

/** Dropdown selector Composable */
export function useFetchSelect(props: FetchSelectProps) {
  const { api } = props;

  const loading = ref<boolean>(false);

  const options = ref<SelectOption[]>([]);

  const value = ref<OptionValue>('');

  // Call the API to get data
  const loadData = () => {
    loading.value = true;
    options.value = [];
    api().then((res) => {
      options.value = res.data ?? [];
    }).finally(() => {
      loading.value = false;
    });
  };

  onMounted(() => {
    loadData();
  });

  return { loading, options, value };
}
