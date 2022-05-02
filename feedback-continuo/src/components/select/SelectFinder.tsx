import {Selectstyled} from '../../pages/register-feedback/RegisterFeedback.styles';

export default ({ onChange, options, value }: any) => {

  const defaultValue = (options: any[], value:any ) => {
    console.log(options)
    return options ? options.find(option => option.value === value) : "";
  };
  
  return (      
    <Selectstyled
      value={defaultValue(options, value)}
      options={options} 
      onChange={value => {
          onChange(value)
      }}
      placeholder="" 
    />      
    )
}