package com.nia.backend.user;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

/** Users created by the Next.js app use ObjectIds; ones created here may use plain strings. */
public final class UserQueries {
    private UserQueries() {}

    public static Query byId(String userId) {
        Object id = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
        return Query.query(Criteria.where("_id").is(id));
    }
}
