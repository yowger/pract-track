{/* <div className="w-full">
            <div className="flex items-center gap-2 py-4">
                <Input
                    placeholder="Filter emails..."
                    value={
                        (table
                            .getColumn("email")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("email")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <Columns3 /> Columns{" "}
                            <ChevronDown className="ml-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <div className="relative">
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                                placeholder="Search"
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                            <SearchIcon className="absolute inset-y-0 my-auto left-2 h-4 w-4" />
                        </div>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                if (
                                    searchQuery &&
                                    !column.id
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase())
                                ) {
                                    return null
                                }

                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                table.resetColumnVisibility()
                                setSearchQuery("")
                            }}
                        >
                            <RefreshCcw /> Reset
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div> */}