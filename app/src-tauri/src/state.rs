use crate::db::prisma::PrismaClient;

pub struct AppState {
    // prismaクライアントを使用することで、dbにクエリを送れる。
    pub prisma_client: PrismaClient,
}
