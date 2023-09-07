import DateTimePicker from "react-datetime-picker";

type DateTimePickerProps = {
    onChange: (deadline: Date | null) => void,
    value: Date | null,
}

export default function Deadline(props: DateTimePickerProps) {
  const {onChange, value} = props;

  return (
    <div>
      <DateTimePicker onChange={(d) => onChange(d)} value={value} />
    </div>
  )
}