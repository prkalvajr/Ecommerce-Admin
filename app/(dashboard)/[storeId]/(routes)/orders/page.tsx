import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

const OrdersPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedOrders: OrderColumn[] = orders.map((order) => ({
        id: order.id,
        createdAt: format(order.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-8">
                <OrderClient data={formattedOrders}/>
            </div>

        </div>
    );
}

export default OrdersPage;