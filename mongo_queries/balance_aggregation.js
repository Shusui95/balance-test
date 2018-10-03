db.getCollection('biwengerusers').aggregate([
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
        $lookup: {
            from: "roundstandings",
            localField: "biwengerId",
            foreignField: "biwengerUserId",
            as: "roundBonuses"
        }
    },{
        $lookup: {
            from: "bonus",
            localField: "biwengerId",
            foreignField: "biwengerUserId",
            as: "bonuses"
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
                    in: { $subtract: ["$$value", "$$this.amount"] }
                }
            },
            "roundsBonus": {
                $reduce: {
                    input: "$roundBonuses",
                    initialValue: 0,
                    in: { $add: ["$$value", "$$this.bonus"] }
                }
            },
            "adminBonus": {
                $reduce: {
                    input: "$bonuses",
                    initialValue: 0,
                    in: { $add: ["$$value", "$$this.amount"] }
                }
            }
        }
    },{
        $addFields: {
            "balance": { $add: ["$gain", "$spend", "$roundsBonus", "$adminBonus"] }
        }
    }
])