import React from "react";
import { 
    Flex, 
    Input,
    IconButton, 
    Editable,
    EditablePreview,
    EditableInput,
    useNumberInput,
    useEditableControls
} from "@chakra-ui/react";
import { EditIcon }  from "@chakra-ui/icons";

const ExitableNumInput =  () => {

    const { getInputProps } = useNumberInput({
        defaultValue: 1,
        min: 1,
        max: 1000,
        precision: 1,
    })
    
    const input = getInputProps()

    const EditableControls = () => {
      const {
        isEditing,
        getEditButtonProps,
      } = useEditableControls()
  
      return isEditing ? null : (
        <Flex justifyContent='center'>
          <IconButton size='sm' icon={<EditIcon />} variant='ghost' {...getEditButtonProps()} />
        </Flex>
      )
    }
  
    return (
      <Editable
        textAlign='center'
        defaultValue='1'
        fontSize='md'
        isPreviewFocusable={false}
      >
        <EditablePreview fontWeight='bold' color='tomato' />
        <Input as={EditableInput} {...input} />
        <EditableControls />
      </Editable>
    )
}

export default ExitableNumInput