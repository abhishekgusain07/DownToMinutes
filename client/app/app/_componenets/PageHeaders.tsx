const PageHeaders = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="flex items-center justify-between my-5">
            {children}
        </div>
    )
}

export default PageHeaders;