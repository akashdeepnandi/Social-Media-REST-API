exports.routeNotFound = (req, res) => {
	res.status(404).json({
		errors: {
			msg: "Endpoint not found",
			param: "app"
		}
	})
}