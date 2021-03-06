import DeleteIcon from "@mui/icons-material/Delete"
import { Button, Chip, Collapse, IconButton, Paper } from "@mui/material"
import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import AddCategoryForm from "./AddCategoryForm"
import AddItemForm from "./AddItemForm"
import Table from "./reusable/Table"
import EditIcon from "@mui/icons-material/Edit"
import styled from "styled-components"
import _ from "lodash"
import { PrimaryButton, SecondaryButton, TextButton } from "../style/Buttons"
import PostAddIcon from "@mui/icons-material/PostAdd"
import AddIcon from "@mui/icons-material/Add"
import Header from "./reusable/Header"
import { useItemCategories, useItems } from "../store/use"
import { flags } from "../store/types"
import { itemCategoriesActions, itemsActions } from "../store"

const Category = styled(Paper)<{ $color: string }>`
    overflow: hidden;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-left: solid ${({ $color }) => $color} 4px;
`

const ItemDisp = styled.div`
    &:first-child {
        border-top: solid #f0f0f0 2px;
    }

    background-color: #fafafa;
    &:nth-child(2n) {
        background-color: #f0f0f0;
    }

    padding: 8px 8px 8px 16px;
    display: flex;
    align-items: center;
    overflow: auto;
`

const ItemName = styled.div``

const ItemParams = styled.div`
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
`

const CategoryContent = styled.div`
    overflow: auto;
`

const ItemActions = styled.div`
    display: flex;
`

const ItemNameAndParams = styled.div`
    display: flex;
    gap: 8px;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
`

const Categories = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 1rem;
`

const CategoryHeader = styled.div<{ $color: string }>`
    padding: 8px 8px 8px 16px;
    display: flex;
    align-items: center;
    color: ${({ $color }) => $color};
    cursor: pointer;
`

const EmptyCategory = styled.div`
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
`

const CategoryHeaderText = styled.div`
    flex: 1;
    font-size: 1.2em;
`

const EmptyCategoryText = styled.div`
    font-weight: 500;
`

const ItemsTable = () => {
    const items = useItems()
    const itemCategories = useItemCategories()
    const dispatch = useDispatch()

    const [addCategory, setAddCategory] = useState<{
        open: boolean
        id: string | undefined
    }>({
        open: false,
        id: undefined,
    })
    const [addItem, setAddItem] = useState<{
        open: boolean
        id: string | undefined
    }>({
        open: false,
        id: undefined,
    })

    const sortedCategories = useMemo(
        () => _.sortBy(itemCategories, "name"),
        [itemCategories],
    )

    const splitedItems = useMemo(
        () => _.groupBy(_.sortBy(items, "name"), "category"),
        [items],
    )

    console.log(items, splitedItems)

    const [open, setOpen] = useState<string>()

    return (
        <>
            <Header
                title="Articles"
                buttons={
                    <>
                        <SecondaryButton
                            onClick={() =>
                                setAddCategory({ open: true, id: undefined })
                            }
                            startIcon={<PostAddIcon />}
                        >
                            Ajouter une cat??gorie
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={() =>
                                setAddItem({ open: true, id: undefined })
                            }
                            startIcon={<AddIcon />}
                        >
                            Ajouter un item
                        </PrimaryButton>
                    </>
                }
            />

            <Categories>
                {sortedCategories.map((ic) => (
                    <Category $color={ic.color}>
                        <CategoryHeader
                            $color={ic.color}
                            onClick={() =>
                                setOpen(ic.id === open ? undefined : ic.id)
                            }
                        >
                            <CategoryHeaderText>{ic.name}</CategoryHeaderText>
                            <IconButton
                                onClick={(ev) => {
                                    ev.stopPropagation()
                                    setAddCategory({
                                        open: true,
                                        id: ic.id,
                                    })
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </CategoryHeader>
                        <Collapse in={ic.id === open}>
                            <CategoryContent>
                                {(splitedItems[ic.id]?.length ?? 0) === 0 && (
                                    <EmptyCategory>
                                        <EmptyCategoryText>
                                            Cette cat??gorie est vide
                                        </EmptyCategoryText>
                                        <TextButton
                                            onClick={() =>
                                                dispatch(
                                                    itemCategoriesActions.delete(
                                                        ic.id,
                                                    ),
                                                )
                                            }
                                        >
                                            Supprimer
                                        </TextButton>
                                    </EmptyCategory>
                                )}
                                {splitedItems[ic.id]?.map((i) => {
                                    return (
                                        <ItemDisp>
                                            <ItemNameAndParams>
                                                <ItemName>{i.name}</ItemName>
                                                <ItemParams>
                                                    {Object.keys(flags).map(
                                                        (flag) => {
                                                            //@ts-ignore
                                                            if (i.flags[flag])
                                                                return (
                                                                    <Chip
                                                                        variant="outlined"
                                                                        size="small"
                                                                        label={
                                                                            //@ts-ignore
                                                                            flags[
                                                                                flag
                                                                            ]
                                                                        }
                                                                    />
                                                                )
                                                            return null
                                                        },
                                                    )}
                                                </ItemParams>
                                            </ItemNameAndParams>
                                            <ItemActions>
                                                <IconButton
                                                    onClick={() =>
                                                        setAddItem({
                                                            open: true,
                                                            id: i.id,
                                                        })
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() =>
                                                        dispatch(
                                                            itemsActions.delete(
                                                                i.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ItemActions>
                                        </ItemDisp>
                                    )
                                })}
                            </CategoryContent>
                        </Collapse>
                    </Category>
                ))}
            </Categories>

            <AddCategoryForm
                id={addCategory.id}
                open={addCategory.open}
                onClose={() =>
                    setAddCategory({
                        open: false,
                        id: addCategory.id,
                    })
                }
            />

            <AddItemForm
                id={addItem.id}
                open={addItem.open}
                onClose={() => setAddItem({ open: false, id: addItem.id })}
            />
        </>
    )
}

export default ItemsTable
