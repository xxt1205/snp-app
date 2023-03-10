import {gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector} from "@mui/x-data-grid";
import {Pagination} from "@mui/material";
import React from "react";

const CustomPagination = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}
export default CustomPagination;