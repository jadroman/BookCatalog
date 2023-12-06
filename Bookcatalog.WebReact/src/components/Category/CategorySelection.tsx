import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect } from "react";

// TODO: put on a common place
type Category = {
    id: string,
    name: string
}

// TODO: put on a common place
export type CategorySelectionProps = {
    inputData: Array<Category>;
    selectedCategory?: string;
    onSelectCategory: (selectedCategory: string) => void; 
};

export default function CategorySelection(props: CategorySelectionProps): JSX.Element {

    const [selectedCategory, setSelectedCategory] = React.useState<string>(props.selectedCategory || '0');

    useEffect(() => {
        props.onSelectCategory(selectedCategory);
    }, [selectedCategory])

    const selectHandleChange = (event: SelectChangeEvent) => {
        setSelectedCategory(event.target.value as string);
        //props.onSelectCategory(selectedCategory);
        //console.log('selectedCategory=>'+ selectedCategory);
    };

    const menuItems = props.inputData.map(i => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)

    return (
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCategory}
            label="Category"
            onChange={selectHandleChange}
        >
            {menuItems}
        </Select>
            /* <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem> */


    )
}