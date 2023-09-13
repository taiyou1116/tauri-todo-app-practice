import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';

type DateTimePickerProps = {
    onChange: (deadline: Date | null) => void,
    value: Date | null,
}

export default function Deadline(props: DateTimePickerProps) {
  const {onChange, value} = props;

  return (
    <div className="mb-48 mr-48">
      <DateTimePicker 
        onChange={(d) => onChange(d)} 
        value={value}
        disableClock={true}
      />
    </div>
  )
}