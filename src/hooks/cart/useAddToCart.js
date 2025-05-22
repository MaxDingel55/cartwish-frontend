import { useMutation, useQueryClient } from "@tanstack/react-query"

const useAddToCart = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({id, quantity}) => apiClient.post(`/cart/${id}`, {quantity}).then(res => res.data),
        onSuccess: () => {
            // Invalidate current data
            // update cached data
            queryClient.invalidateQueries({
                queryKey: ["cart"]
            });
        }
    })
}

export default useAddToCart