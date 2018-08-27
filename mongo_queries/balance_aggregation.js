db.getCollection('users').aggregate([
    {
        $match: {}
    },{
        $lookup: {
            from: "transfers",
            localField: "biwengerId",
            foreignField: "from",
            as: "gainTransfers"
        }
    },{
        $lookup: {
            from: "transfers",
            localField: "biwengerId",
            foreignField: "to",
            as: "spendingTransfers"
        }
    },{
        $project: {
            "_id": 0,
            "biwengerId": 1,
            "name": 1,
            "gain": {
                $reduce: {
                    input: "$gainTransfers",
                    initialValue: 0,
                    in: { $add: ["$$value", "$$this.amount"] }
                }
            },
            "spend": {
                $reduce: {
                    input: "$spendingTransfers",
                    initialValue: 0,
                    in: { $add: ["$$value", "$$this.amount"] }
                }
            }
        }
    },{
        $addFields: {
            "balance": { $subtract: ["$gain", "$spend"] }
        }
    }
])