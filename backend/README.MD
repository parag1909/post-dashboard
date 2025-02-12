package "Post Module" {
    class PostModel {
        - _id: ObjectId
        - title: String
        - content: String
        - image: String
        - author: ObjectId
        - createdAt: Date
        - updatedAt: Date
        + validate(): void
        + beforeSave(): void
    }

    class PostValidator {
        + {static} validatePost(title: String, content: String): Array<String>
        - validateTitle(title: String): Array<String>
        - validateContent(content: String): Array<String>
    }

    class PostService {
        + {static} createPost(postData: Object, userId: String, imageFile: File): Post
        + {static} getPosts(page: Number, limit: Number): Object
        - uploadImageToCloudinary(imageFile: File): String
        - validatePostData(postData: Object): void
    }

    class PostController {
        + createPost(req: Request, res: Response): void
        + getPosts(req: Request, res: Response): void
        - handlePostCreation(postData: Object): Post
        - handlePostRetrieval(page: Number, limit: Number): Object
    }

    class CloudinaryService {
        + {static} uploadImage(file: File, folder: String): Object
        + {static} generateImageUrl(uploadResult: Object): String
    }

    class PostRouter {
        + registerRoutes(): void
        - setupPostCreationRoute(): void
        - setupPostRetrievalRoute(): void
    }

    class AuthMiddleware {
        + {static} verifyToken(req: Request, res: Response, next: Function): void
        - extractTokenFromHeader(req: Request): String
        - validateToken(token: String): Object
    }

    class ErrorHandler {
        + {static} handlePostCreationError(error: Error): Object
        + {static} handlePostRetrievalError(error: Error): Object
        - logError(error: Error): void
        - formatErrorResponse(error: Error): Object
    }
}